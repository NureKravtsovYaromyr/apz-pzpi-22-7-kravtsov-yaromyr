// Підсистема A: відповідає за виконання операції A
class SubsystemA {
    operationA(): string {
        return "Результат операції A";
    }
}

// Підсистема B: відповідає за виконання операції B
class SubsystemB {
    operationB(): string {
        return "Результат операції B";
    }
}

// Фасад: об’єднує роботу підсистем і забезпечує єдиний інтерфейс
class Facade {
    private subsystemA: SubsystemA;
    private subsystemB: SubsystemB;

    // Конструктор ініціалізує підсистеми
    constructor() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
    }

    // Метод operation() викликає методи підсистем і об’єднує їх результати
    public operation(): string {
        const resultA = this.subsystemA.operationA();
        const resultB = this.subsystemB.operationB();
        return `Facade об’єднує: [${resultA}] та [${resultB}]`;
    }
}

// Демонстрація використання фасаду
const facade = new Facade();
console.log(facade.operation());
