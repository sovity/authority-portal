package de.sovity.authorityportal.client.oauth2;

import de.sovity.authorityportal.client.gen.ApiClient;
import de.sovity.authorityportal.client.gen.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.Request;

/**
 * OAuth2 Token Response Fetcher for the "Client Credentials Grant" Flow
 */
@RequiredArgsConstructor
public class OAuth2TokenFetcher {
    private final OAuth2ClientCredentials clientCredentials;
    private final ApiClient apiClient = new ApiClient();

    /**
     * Fetch an access token for a "Client Credentials" Grant
     *
     * @return the token response including the access token
     */
    @SneakyThrows
    public OAuth2TokenResponse fetchToken() {
        var formData = new FormBody.Builder()
                .add("grant_type", "client_credentials")
                .add("client_id", clientCredentials.getClientId())
                .add("client_secret", clientCredentials.getClientSecret())
                .build();

        var request = new Request.Builder()
                .url(clientCredentials.getTokenUrl())
                .post(formData)
                .build();

        // Re-use the Utils for OkHttp from the OpenAPI generator
        Call call = apiClient.getHttpClient().newCall(request);
        ApiResponse<OAuth2TokenResponse> response = apiClient.execute(call, OAuth2TokenResponse.class);
        return response.getData();
    }
}
