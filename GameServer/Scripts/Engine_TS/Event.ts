module slowpoke {
    export interface IEvent<T> {
        add(handler: { (data?: T): void });
        remove(handler: { (data?: T): void });
    }

    export class Event<T> implements IEvent<T> {
        private handlers: { (data?: T): void; }[] = [];

        public add(handler: { (data?: T): void }) {
            this.handlers.push(handler);
        }

        public remove(handler: { (data?: T): void }) {
            this.handlers = this.handlers.filter(h => h !== handler);
        }

        public trigger(data?: T) {
            if (this.handlers) {
                this.handlers.slice(0).forEach(h => h(data));
            }
        }
    }
}