---
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${FE_PRONAME}
  namespace: ${K8S_NAMESPACE}
  labels:
    app: ${FE_PRONAME}
spec:
  selector:
    matchLabels:
      app: ${FE_PRONAME}
  replicas: 1
  template:
    metadata:
      labels:
        app: ${FE_PRONAME}
    spec:
      terminationGracePeriodSeconds: 30
      imagePullSecrets:
        - name: harborsecret
      containers:
      - name: ${FE_PRONAME}
        image: ${imgrepoAddr}/${ProjectName}/${FE_PRONAME}:${GIT_BRANCH}-${BDATE}-${GIT_COMMIT_ID}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
          name: web
          protocol: TCP
---
#svc
apiVersion: v1
kind: Service
metadata:
  name: ${FE_PRONAME}
  namespace: ${K8S_NAMESPACE}
  labels:
    app: ${FE_PRONAME}
spec:
  selector:
    app: ${FE_PRONAME}
  type: NodePort
  ports:
  - name: ${FE_PRONAME}
    port: 80
    targetPort: web
    #nodePort: 30102