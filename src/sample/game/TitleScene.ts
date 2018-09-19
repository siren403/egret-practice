
namespace I {
    export function IViewModel(): IViewModel {

        let vm: IViewModel;
        return vm;
    }
}


function Inject<T>(key: (() => T)): T {
    return key();
}

interface ICommand {

}

interface IViewModel {
    do(command: ICommand): void;
}
class ViewModel1 implements IViewModel {

    public do(command: ICommand): void {

    }
}

class TitleScene extends Scene {

    private _viewModel = Inject(I.IViewModel);

    public create(): void {

    }

}