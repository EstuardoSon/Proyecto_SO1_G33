# Kubernetes
El despliegue de todos los Backends se realiza en un cluster de kubernetes en google cloud, para su despliegue se utilizan diversos archivos Yaml.

## Archivos

### NameSpace.yaml
Creacion de un NameSpace en el cluster de nombre *proyectoso1*.

```
apiVersion: v1
kind: Namespace
metadata:
  name: proyectoso1
```

# Cloud Run