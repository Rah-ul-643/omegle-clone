class Queue {
    constructor() {
        this.items = {};
        this.head = 0; // Points to the front of the queue
        this.tail = 0; // Points to the end of the queue
    }

    // Enqueue (add element to the end)
    enqueue(element) {
        this.items[this.tail] = element;
        this.tail++;
    }

    // Dequeue (remove element from the front)
    dequeue() {
        if (this.isEmpty()) {
            return null; // Handle underflow
        }
        const element = this.items[this.head];
        delete this.items[this.head]; // Remove the front element
        this.head++;
        return element;
    }

    remove(element) {
        for (let i = this.head; i < this.tail; i++) {
            if (this.items[i] === element) {
                delete this.items[i];
                return true;
            }
        }
        return false;
    }

    // Peek (view the front element)
    peek() {
        return this.isEmpty() ? null : this.items[this.head];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.head === this.tail;
    }

    // Get the size of the queue
    size() {
        return this.tail - this.head;
    }
}

module.exports = Queue;
