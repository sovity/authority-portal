<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "header">
        ${msg("emailForgotTitle")}
    <#elseif section = "form">
        <div class="cardContainer">
            <div class="formContainer">
                <div class="formHeader">
                    <h3>UPDATE PASSWORD</h3>
                </div>
                <div class="formBody">
                    <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <#if auth?has_content && auth.showUsername()>
                                    <input type="text" id="username" name="username" placeholder="Email" class="text-input" autofocus value="${auth.attemptedUsername}" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
                                <#else>
                                    <input type="text" style="color:white" id="username" name="username" placeholder="Email" class="text-input" autofocus aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
                                </#if>
                            </div>
                        </div>
                        <#if messagesPerField.existsError('username')>
                            <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('username'))?no_esc}
                            </span>
                        </#if>
            
                        <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}" style="margin-bottom: 40px; margin-top: 20px;">
                            <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                                <div class="${properties.kcFormOptionsWrapperClass!}">
                                    <span><a href="${url.loginUrl}" style="color:black; margin-bottom: 40px">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                                </div>
                            </div>

                            <div class="${properties.kcFormButtonsClass!}">
                                <input style="margin-bottom:40px" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    <#elseif section = "info" >
        ${msg("emailInstruction")}
    </#if>
</@layout.registrationLayout>
