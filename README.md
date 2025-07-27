# Clouflare nodes

This repository is forked from the n8n node start repository.

Its goal is to develop nodes for Cloudflare services.

Cloudflare has grown from a network security company to a full-fledged cloud provider, offering a wide range of services including AI services, AutoRAG, cloud storage (r2), database and data catalog services using R2, D1 and worker functions.

## Nodes

### R2

We need R2 nodes to add files to R2 (with options to create the bucket if it does not exist) and all the REST operations on R2 objects (list, get, delete, etc.). R2 is private by default such that the user would manully have to go to the cloudflare dashboard to make the bucket public.

### D1

D1 is a serverless SQL database that can be used to store structured data. We need nodes to create, read, update, and delete records in D1 databases.

We need a node to interact with it as there is a supabase node and other nodes for SQL databases.

### AI modules

Cloudflare offers many models for different applications via their ai services. This node must integrate with the most used models such as completions, image generation and transcription.
