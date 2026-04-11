# T12 - TypeScript

Ejemplos de código TypeScript para APIs con Express.

## Estructura

```
codigo/T12/
├── src/
│   ├── types/
│   │   └── index.ts           # Tipos e interfaces
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── routes/
│   │   └── users.routes.ts
│   ├── middleware/
│   │   └── validate.ts        # Middleware tipado
│   ├── utils/
│   │   └── response.ts        # Helpers tipados
│   └── app.ts
├── tsconfig.json
└── package.json
```

## Instalación

```bash
npm install
npm run dev    # Desarrollo con watch
npm run build  # Compilar a JavaScript
npm start      # Ejecutar compilado
```

## Conceptos demostrados

- Interfaces y tipos personalizados
- Generics
- Type guards
- Express con tipos
- Zod para validación
- Utility types (Partial, Pick, Omit)
