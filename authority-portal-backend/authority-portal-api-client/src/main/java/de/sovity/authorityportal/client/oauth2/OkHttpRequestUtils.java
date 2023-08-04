package de.sovity.authorityportal.client.oauth2;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import okhttp3.Request;
import okhttp3.Response;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OkHttpRequestUtils {
    public static boolean hadBearerToken(@NonNull Response response) {
        String header = response.request().header("Authorization");
        return header != null && header.startsWith("Bearer");
    }

    @NonNull
    public static Request withBearerToken(@NonNull Request request, @NonNull String accessToken) {
        return request.newBuilder()
                .removeHeader("Authorization")
                .header("Authorization", "Bearer " + accessToken)
                .build();
    }
}

