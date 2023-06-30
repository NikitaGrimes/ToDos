import { FormControl } from "@angular/forms";

export interface TodoForm {
    todo: FormControl<string>;
    completed: FormControl<boolean>;
}
