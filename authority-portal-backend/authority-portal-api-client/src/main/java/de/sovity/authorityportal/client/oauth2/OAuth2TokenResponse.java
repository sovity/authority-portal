package de.sovity.authorityportal.client.oauth2;

import com.google.gson.annotations.SerializedName;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Credentials for connecting to the EDC via the OAuth2 "Client Credentials" flow.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class OAuth2TokenResponse {

    @SerializedName("access_token")
    private String accessToken;
}
