"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"
import authClient from "@/auth/authClient";
import { toast } from "sonner"
import { useEffect, useState, useTransition } from "react"; // or standard react
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import * as React from "react"
import { ConsoleLogWriter } from "drizzle-orm";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be at most 128 characters" }),
  rememberMe: z.boolean().default(true),
});

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {

      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard", 
          rememberMe: value.rememberMe || false,
        },
        {
          onSuccess: (context) => {
            // console.log("Login successful:", context);
            toast.success("Login successful!");
          },
          onError: (context) => {
            // console.error("Login failed:", context.error);
            toast.error(`Login failed`, {
              description: `${context.error.message}`,
            });
          }
        }
      );
    },
  });

  async function signInWithGoogle() {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  const [email, setEmail] = useState("");
  const [checked, setChecked] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your details below to login to your account</CardDescription>
        <CardAction>
          <Button asChild variant="link" className="w-full">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user@example.com"
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link href="/forgot-password" className="text-xs text-muted-foreground ml-auto hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      type="password"
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="rememberMe"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <Field data-invalid={isInvalid} >
                    <div className="flex items-center gap-1">
                      <Checkbox 
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                        aria-invalid={isInvalid}
                      />
                      <FieldLabel htmlFor={field.name}>
                        Remember me
                      </FieldLabel>
                    </div>
                    {/* <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      type="password"
                      required
                    /> */}
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" form="login-form" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? <Spinner className="h-4 w-4"/> : <span>Login</span>}
        </Button>
        <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
