<#import "template.ftl" as layout>
<#import "register-commons.ftl" as registerCommons>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('firstName','lastName','email','username','password','password-confirm','termsAccepted'); section>
    <#if section = "header">
       
    <#elseif section = "form">
        <div class="formContainer">
            <div class="formHeader">
                    <h3>REGISTRATION FORM</h3>
            </div>
            <div class="formBody">
                    <div id="kc-form">
                        <form id="kc-register-form" action="${url.registrationAction}" class="formContainer" method="post">
                        <#-- First name -->
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="text" id="first-name" placeholder="First Name"
                                       class="text-input"
                                       name="firstName"
                                       value="${(register.formData.firstName!'')}"
                                />
                            </div>
                        </div>
                        <span id="fe-input-error-first-name" class="${properties.kcInputErrorMessageClass!}">
                            Please specify a first name.
                        </span>

                        <#-- Last name -->
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="text" id="last-name" placeholder="Last Name" class="text-input"
                                       name="lastName"
                                       value="${(register.formData.lastName!'')}"
                                />
                            </div>
                        </div>
                        <span id="fe-input-error-last-name" class="${properties.kcInputErrorMessageClass!}">
                            Please specify a last name.
                        </span>

                        <#-- E-mail -->
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="email" id="email" placeholder="E-mail" class="text-input" name="email"
                                       value="${(register.formData.email!'')}" autocomplete="email"
                                />
                            </div>
                            <#if messagesPerField.existsError('email')>
                                <span id="input-error-email" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                    ${kcSanitize(messagesPerField.get('email'))?no_esc}
                                </span>
                            </#if>
                        </div>
                            <span id="fe-input-error-email" class="${properties.kcInputErrorMessageClass!}">
                                Please specify a valid email address.
                            </span>


                        <#-- User name -->
                        <#if !realm.registrationEmailAsUsername>
                            <div class="${properties.kcFormGroupClass!}" style="display:none">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="text" id="username"  placeholder="Username" class="text-input" name="username"
                                           value="${(register.formData.username!'')}" autocomplete="username"
                                    />
                                </div>
                            </div>
                        </#if>

                        <#if passwordRequired??>
                            <div class="${properties.kcFormGroupClass!}">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="password" id="password" class="text-input" placeholder="Password" name="password"
                                           autocomplete="new-password"
                                           value="${(register.formData['password']!'')}"
                                    />
                                </div>
                                <#if messagesPerField.existsError('password')>
                                    <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('password'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                                <span id="fe-input-error-password" class="${properties.kcInputErrorMessageClass!}">
                                           Please specify a password.
                                </span>

                            <div class="${properties.kcFormGroupClass!}">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="password" id="password-confirm" class="text-input" placeholder="Confirm Password"
                                           name="password-confirm"
                                           value="${(register.formData['password-confirm']!'')}"
                                    />
                                </div>
                            </div>
                            <#if messagesPerField.existsError('password-confirm')>
                                <span id="fe-input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}">
                                            ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                                </span>
                            </#if>
                        </#if>

                        <@registerCommons.termsAcceptance/>

                            <#-- ReCaptcha -->
                        <#if recaptchaRequired??>
                            <div class="form-group">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                                </div>
                            </div>
                        </#if>

                        <#-- "Back-to-login" link -->
                        <div class="${properties.kcFormGroupClass!}">
                            <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                                <div class="${properties.kcFormOptionsWrapperClass!}">
                                    <span>
                                        <a href="${url.loginUrl}">
                                            ${kcSanitize(msg("backToLogin"))?no_esc}
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="${properties.kcFormGroupClass!}" style="margin-bottom: 20px">
                                <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                                       type="submit" value="${msg("doRegister")}"/>
                        </div>
                    </form>
                    </div>
            </div>
        </div>
        <script type="application/javascript">
            'use strict'

            const errorMessage = (id) => document.getElementById('fe-input-error-' + id);

            const inputElement = (id) => document.getElementById(id);

            const validateField = (id, validateFn) => {
                const input = inputElement(id);
                const valid = !!validateFn(input.value);

                errorMessage(id)?.classList?.toggle('hidden', valid);
                return valid;
            };

            const pattern = /^\d{10}$/;

            const fields = [
                ['first-name', it => it?.trim()?.length],
                ['last-name', it => it?.trim()?.length],
                ['email', it => it?.trim()?.length],
                ['password', it => it?.trim()?.length],
            ];
            const validateForm = (event) => {
                let invalidFields = [];
                
                fields.forEach(([id, validationFn]) => {
                    const valid = validateField(id, validationFn);
                    if (!valid) {
                        invalidFields.push(id);
                    }
                });

                if (invalidFields.length > 0) {
                    invalidFields.forEach((id) => {
                        errorMessage(id)?.classList?.remove('hidden');
                    });
                    event.preventDefault();
                }
            };
            

            addEventListener('load', () => {
                let form = document.getElementById('kc-register-form');
                form.addEventListener('submit', validateForm);
                form.classList.remove('hidden');
                fields.forEach(([id]) => {
                    errorMessage(id)?.classList?.add('hidden');
                });
            });
        </script>
    </#if>
</@layout.registrationLayout>