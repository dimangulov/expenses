import { Injectable } from "@angular/core";
import { FilterDescriptor, CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { URLSearchParams, RequestOptionsArgs } from '@angular/http';

type OperatorFunction = (property:string, value:string) => string;

@Injectable()
export class FilterHelper {
    /**
     * Map between kendo operators and odata operators
     */
    static Operators = {
        "eq": "=",
        "neq": "!=",
        "isnull": (prop, value) => `${prop}=null)`,
        "isnotnull": (prop, value) => `${prop}!=null)`,
        "lt": "<",
        "lte": "<=",
        "gt": ">",
        "gte": ">=",
        "startswith": (prop, value) => `${prop}StartsWith=${value}`,
        "endswith": (prop, value) => `${prop}EndsWith=${value}`,
        "contains": (prop, value) => `${prop}Contains=${value}`
    };

    public Build(filter: FilterDescriptor | CompositeFilterDescriptor):string[] {
        if (typeof filter === "object") {
            return this.BuildByObject(filter);
        }
        
        throw new Error("Not supported filter - " + filter);
    }

    private BuildByObject(filter: FilterDescriptor | CompositeFilterDescriptor):string[] {
        if ((<FilterDescriptor>filter).operator) {
            return [this.BuildBySimpleFilter(<FilterDescriptor>filter)];
        }

        if ((<CompositeFilterDescriptor>filter).logic) {
            return this.BuildByComplexFilter(<any>filter);
        }

        throw new Error("Filter not supported - " + filter);
    }

    private BuildBySimpleFilter(filter: FilterDescriptor) {
        let operator = FilterHelper.Operators[<string>filter.operator];

        if (!operator) {
            throw new Error(`Odata operator not found for kendo operator - ${filter.operator}`);
        }

        let value:string;

        if (typeof filter.value === "number") {
            value = `${filter.value}`;
        } else if (typeof filter.value === "string") {
            value = `${filter.value}`;
        } else if (typeof filter.value === "boolean") {
            value = `${filter.value}`;
        } else if (filter.value instanceof Date) {
            value = `${JSON.stringify(filter.value)}`;
            value = value.slice(1, value.length - 1);
        } else if (filter.value === null || filter.value === undefined) {
            value = `null`;
        } else {
            throw new Error(`Not supported type - ${typeof filter.value} - ${JSON.stringify(filter)}`);
        }

        if (typeof operator === "string") {
            return `${filter.field}${operator}${value}`;
        }

        if (typeof operator === "function") {
            let resultBuilder = <OperatorFunction>operator;
            return resultBuilder(<string>filter.field, value);
        }

        throw new Error(`Not supported operator for kendo operator - ${filter.operator}`);
    }

    private BuildByComplexFilter(filters: CompositeFilterDescriptor) {
        if (filters.filters.length === 0) return null;

        return filters.filters
            .map(f => this.BuildByObject(f)[0]);
        /*var result = filters.filters
                .map(f => this.BuildByObject(f))
                .reduce((prev, curr) => `${prev} ${filters.logic} ${curr}`)
            ;

        return `(${result})`;*/
    }

    buildRequest(options: RequestOptionsArgs, state:State) {
        var commands = [];

        if (state.skip) {
            commands.push("skip=" + state.skip);
        }

        if (state.take) {
            commands.push("take=" + state.take);
        }

        if (state.filter) {
            var filterParams = this.Build(state.filter);
            console.log(filterParams);

            commands = [...commands, ...filterParams];
        }

        if (state.sort && state.sort.length > 0) {
            let sort = state.sort[0];
            var dir = sort.dir == "asc" ? "orderby" : "orderbydesc";
            commands.push(dir + "=" + sort.field);
        }

        console.log(commands);
        var commandsText = commands.reduce((prev, curr) => prev + "&" + curr);
        console.log(commandsText);

        var params = new URLSearchParams();
        params.set("commands", commandsText);

        options.search = params;
    }
}
