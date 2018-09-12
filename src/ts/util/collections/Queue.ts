namespace Collections {
    export class Queue<T>{
        private dataStore: T[] = [];
        public enqueue(element: T): void {
            this.dataStore.push(element);
        }
        public dequeue(): T {
            return this.dataStore.shift()
        }
        public front(): T {
            return this.dataStore[0]
        }
        public back(): T {
            return this.dataStore[this.dataStore.length - 1]
        }
    }
}