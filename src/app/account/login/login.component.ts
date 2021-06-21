import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/_services/auth.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    isMessage = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    get f() { return this.form.controls; }


    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        this.authService.login(this.form.value)
            .subscribe(response => {

                if (response !== null) {
                    const token: string = (<any>response).token;
                    console.log(token);

                    this.router.navigate(['/salon'], { relativeTo: this.route });
                }
                else {
                    console.log('Login invalid '+ response);
                }
            },
                error => {
                    this.isMessage = true;
                    console.log('Login invalid' + error);
                    this.loading = false;
                });
    }
}
