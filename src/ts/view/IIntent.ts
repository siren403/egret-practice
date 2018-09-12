interface IIntent {

}

class EmptyIntent implements IIntent {

    public static readonly instance: EmptyIntent = new EmptyIntent();

    private constructor() {

    }
}