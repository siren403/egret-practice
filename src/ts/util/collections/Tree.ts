namespace Collections {
    
    export class TreeNode<T extends IData> {
        public constructor(
            public data: T,
            public parent: TreeNode<T> = null,
            public children: TreeNode<T>[] = []
        ) { }
    }

    type TreeCallback<T extends IData> = ((current: TreeNode<T>) => void);

    export class Tree<T extends IData>{
        private root: TreeNode<T> = null;
        public constructor(root: TreeNode<T>) {
            this.root = root;
        }

        public traverseDF(callback: TreeCallback<T>): void {
            // this is a recurse and immediately-invoking function
            (function recurse(currentNode) {
                // step 2
                for (var i = 0, length = currentNode.children.length; i < length; i++) {
                    // step 3
                    recurse(currentNode.children[i]);
                }

                // step 4
                callback(currentNode);

                // step 1
            })(this.root);
        };

        public traverseBF(callback: TreeCallback<T>): void {
            var queue = new Queue<TreeNode<T>>();

            queue.enqueue(this.root);

            let currentTree: TreeNode<T> = queue.dequeue();

            while (currentTree) {
                for (var i = 0, length = currentTree.children.length; i < length; i++) {
                    queue.enqueue(currentTree.children[i]);
                }

                callback(currentTree);
                currentTree = queue.dequeue();
            }
        };

        public contains(callback: TreeCallback<T>, traversal: ((callback: TreeCallback<T>) => void)): void {
            traversal.call(this, callback);
        };

        public add(data: T, toData: T, traversal: ((callback: TreeCallback<T>) => void)) {
            let child: TreeNode<T> = new TreeNode<T>(data);
            let parent: TreeNode<T> = null;
            let callback: TreeCallback<T> = function (node) {
                if (node.data.equals(toData)) {
                    parent = node;
                }
            };

            this.contains(callback, traversal);

            if (parent) {
                parent.children.push(child);
                child.parent = parent;
            } else {
                throw new Error('Cannot add node to a non-existent parent.');
            }
        };

        public remove(data: T, fromData: T, traversal: ((callback: TreeCallback<T>) => void)): TreeNode<T>[] {
            let tree: Tree<T> = this;
            let parent: TreeNode<T> = null;
            let childToRemove: TreeNode<T>[] = null;
            let index: number = -1;

            let callback: TreeCallback<T> = function (node) {
                if (node.data.equals(fromData)) {
                    parent = node;
                }
            };

            this.contains(callback, traversal);

            if (parent) {
                index = this.findIndex(parent.children, data);

                if (index === -1) {
                    throw new Error('Node to remove does not exist.');
                } else {
                    childToRemove = parent.children.splice(index, 1);
                }
            } else {
                throw new Error('Parent does not exist.');
            }

            return childToRemove;
        };

        private findIndex(arr, data): number {
            let index: number = -1;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].data === data) {
                    index = i;
                }
            }
            return index;
        }
    }
}