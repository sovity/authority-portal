package de.sovity.authorityportal.client.oauth2;

import lombok.RequiredArgsConstructor;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;

/**
 * OkHttp Interceptor: Adds Bearer Token to requests
 */
@RequiredArgsConstructor
public class OAuth2CredentialsInterceptor implements Interceptor {
    private final OAuth2CredentialsStore credentialsStore;

    @NotNull
    @Override
    public Response intercept(Chain chain) throws IOException {
        String accessToken = credentialsStore.getAccessToken();
        Request request = OkHttpRequestUtils.withBearerToken(chain.request(), accessToken);
        return chain.proceed(request);
    }

}
