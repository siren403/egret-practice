class CalcEngine {

    private data: any = null;

    public set(data: IMap<any>): CalcEngine {
        this.data = data;
        return this;
    }
    public modify(key: string, value: any): CalcEngine {

        if (this.data && this.data[key] !== undefined) {
            this.data[key] = value;
        }
        return this;
    }

    public calculate(expression: string): number {
        let define = '';

        if (Object.isEmpty(this.data) === false) {
            let keys = Object.keys(this.data);
            for (let i = 0; i < keys.length; i++) {
                define += `let ${keys[i]} = ${this.data[keys[i]]};`;
            }
        }
        return (function (define, expression) {
            return eval(define + expression);
        })(define, expression);
    }
}