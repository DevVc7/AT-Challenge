FROM mcr.microsoft.com/vscode/devcontainers/dotnet:2.1

ENV YARNKEY=yarn-keyring.gpg
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo gpg --dearmour -o /usr/share/keyrings/$YARNKEY && \
    echo "deb [signed-by=/usr/share/keyrings/$YARNKEY] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Install .NET Core 6 SDK needed for the Language Server
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
dpkg -i packages-microsoft-prod.deb && \
apt-get update && \
apt-get install -y dotnet-sdk-6.0

WORKDIR /app

COPY . .

CMD ["/bin/sh", "-c", "while sleep 1000; do :; done"]