// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        correo: { label: "Correo", type: "text" },
        contraseña: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              correo: credentials?.correo,
              contraseña: credentials?.contraseña,
            }),
          });

          const user = await res.json();

          if (res.ok && user?.token) {
            const payload = JSON.parse(atob(user.token.split('.')[1]));

            return {
              id: payload.id,
              nombre: user.usuario?.nombre,
              correo: user.usuario?.correo,
              rol_id: user.usuario?.rol_id,
              token: user.token,
              faena_id: payload.faena_id, // ✅ faena_id desde el token
            };
          }

          return null;
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol_id = user.rol_id;
        token.token = user.token;
        token.nombre = user.nombre;
        token.faena_id = user.faena_id; // ✅ Propagar faena_id al token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as number,
          rol_id: token.rol_id as number,
          token: token.token as string,
          nombre: token.nombre as string,
          faena_id: token.faena_id as number, 
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
