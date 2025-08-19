#!/bin/bash
echo "Self-signed certificate and key generated in $CERT_DIR"

# Generate a self-signed SSL certificate for development
# Output: cert.pem (certificate), key.pem (private key)
# Usage: ./generate-cert.sh

CERT_DIR="$(dirname "$0")/../certs"
mkdir -p "$CERT_DIR"


# Prevent Git Bash from converting -subj to a Windows path
MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"

