interface IRandomItemElement<T> {
    item: T;
    percent: number;
}
interface IRandomItemProvider<T> {
    setElements(elements: IRandomItemElement<T>[]): void;
    get(): T;
}

class RandomItemProvider<T> implements IRandomItemProvider<T>{

    private elements: IRandomItemElement<T>[] = null;

    public setElements(elements: IRandomItemElement<T>[]): void {
        this.elements = elements.concat();

        this.validate(this.elements);
        this.elements.sort((a, b) => a.percent - b.percent);

        let latestPercent: number = 0;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i] = Object.assign<IRandomItemElement<T>>({}, this.elements[i]);
            this.elements[i].percent += latestPercent;
            latestPercent = this.elements[i].percent;
        }
    }

    private validate(elements: IRandomItemElement<T>[]): void {
        let totalProbability: number = 0;
        for (let element of elements) {
            totalProbability += element.percent;
        }
        if (totalProbability !== 100) {
            throw new Error('not 100 percent data');
        }
    }

    public get(): T {
        let n = Math2.random(0, 100);
        let item: T;
        let min: number = 0;
        for (let element of this.elements) {
            if ((min == 0 ? n >= min : n > min) && n <= element.percent) {
                item = element.item;
                break;
            } else {
                min = element.percent;
            }
        }
        if (item === undefined) {
            throw new Error('result is undefined');
        }
        return item;
    }
}