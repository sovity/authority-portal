<#import "template.ftl" as layout>
<#import "user-profile-commons.ftl" as userProfileCommons>
<#import "register-commons.ftl" as registerCommons>
<@layout.registrationLayout displayMessage=messagesPerField.exists('global') displayRequiredFields=true; section>
    <#if section = "header">
    <#elseif section = "form">
        <div class="cardContainer">
            <div class="formContainer">
                <div class="formHeader">
                    <h3>REGISTRATION FORM</h3>
                </div>
                <div class="formBody">
                    <div id="kc-form">
                        <form id="kc-register-form" class="${properties.kcFormClass!} formContainer" action="${url.registrationAction}" method="post">
                            <@userProfileCommons.userProfileFormFields; callback, attribute>
                                <#if callback = "afterField">
                            <#-- render password fields just under the username or email (if used as username) -->
                                <#if passwordRequired?? && (attribute.name == 'username' || (attribute.name == 'email' && realm.registrationEmailAsUsername))>
                                    <div class="${properties.kcFormGroupClass!}">
                                        <div class="${properties.kcLabelWrapperClass!}">
                                            <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label> *
                                        </div>
                                        <div class="${properties.kcInputWrapperClass!}">
                                            <input type="password" id="password" class="${properties.kcInputClass!}" name="password"
                                                   autocomplete="new-password"
                                                   aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                                            />
                                            <#if messagesPerField.existsError('password')>
                                                <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                                    ${kcSanitize(messagesPerField.get('password'))?no_esc}
                                                </span>
                                            </#if>
                                        </div>
                                    </div>

                                    <div class="${properties.kcFormGroupClass!}">
                                        <div class="${properties.kcLabelWrapperClass!}">
                                            <label for="password-confirm"
                                                   class="${properties.kcLabelClass!}">${msg("passwordConfirm")}</label> *
                                        </div>
                                        <div class="${properties.kcInputWrapperClass!}">
                                            <input type="password" id="password-confirm" class="${properties.kcInputClass!}"
                                                   name="password-confirm"
                                                   aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                                            />

                                            <#if messagesPerField.existsError('password-confirm')>
                                                <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                                    ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                                                </span>
                                            </#if>
                                        </div>
                                    </div>
                                </#if>
                            </#if>
                            </@userProfileCommons.userProfileFormFields>

                            <@registerCommons.termsAcceptance/>

                            <#if recaptchaRequired??>
                                <div class="form-group">
                                    <div class="${properties.kcInputWrapperClass!}">
                                        <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                                    </div>
                                </div>
                            </#if>

                            <div class="${properties.kcFormGroupClass!}">
                                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                                    <div class="${properties.kcFormOptionsWrapperClass!}">
                                        <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                                    </div>
                                </div>

                                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
