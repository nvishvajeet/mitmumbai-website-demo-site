# Data silo policy

## Boundary

Every client owns a separate repository, deployment identity and runtime data
plane. Shared patterns are build inputs, not a shared application database.

Each client must have unique values for:

- public hostname and TLS certificate;
- database name, database user and credentials;
- schema/migration history;
- SSO/OAuth client and callback URLs;
- session-cookie name and signing key;
- media/private-upload root or object-storage bucket;
- cache prefix, queue namespace and notification sender;
- backups, retention rules, restore test and audit log.

## Allowed centrally

The shared repository may contain parameter names, schemas, example
environments, migrations patterns, container definitions, reverse-proxy
templates, network policies and safe defaults.

It must never contain instantiated production values, client content, real
credentials, personal data, private uploads, database dumps or backup keys.

A component contributed from a client must use placeholders and neutral
examples. Its original client route, copy, media, people and domain must remain
in that client's repository.

## Runtime rules

1. A client process connects only to its own database and storage.
2. Cross-client reads are denied by network and database permissions.
3. Runtime state lives outside the application checkout.
4. Development never uses authoritative production data.
5. A backup restores into the same client boundary or a quarantined
   client-specific recovery environment.
6. Shared-template upgrades do not migrate client data automatically.
7. A client migration runs only after that client's tests, backup and approval.
