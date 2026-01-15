CA Key password is 123456

To import CA root certificate into windows certificate store
1. Open Powershell as Admin and navigate to the folder where CA root certificate is located at
2. Import-Certificate -FilePath "ca.pem" -CertStoreLocation Cert:\LocalMachine\Root
3. test the leaf certificates , they should now be trusted
