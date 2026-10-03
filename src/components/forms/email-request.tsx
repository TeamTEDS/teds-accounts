"use client"

import type { ReactElement } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  emailRequestSchema,
  uses,
} from "@/lib/validation/email-request"
import { EmailUsageCombobox } from "./subcomponents/email-usage"

import { useForm } from "@tanstack/react-form"
import { useState } from "react"

export function EmailRequestDialog({
  trigger,
  open,
  onOpenChange,
}: {
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen

  function handleOpenChange(nextOpen: boolean) {
    setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  const form = useForm({
    defaultValues: {
      email: "",
      usage: "",
      primaryEmail: "",
      reason: "",
    },
    validators: {
      onSubmit: emailRequestSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value)
      await fetch("/api/email-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
      handleOpenChange(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <form
        id="email-request-form"
        className="min-w-0 flex-1"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Request</DialogTitle>
            <DialogDescription>
              Make requests for additional features or emails.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <Label htmlFor={field.name}>
                    Email<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    required
                    placeholder="email@teds.one"
                    autoComplete="off"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />
            <form.Field
              name="usage"
              children={(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <Label htmlFor={field.name}>
                    Usage<span className="text-destructive">*</span>
                  </Label>
                  <EmailUsageCombobox
                    uses={uses}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                    onBlur={field.handleBlur}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />
            <form.Subscribe
              selector={(state) => state.values.usage}
              children={(usage) => (
                <>
                  {usage === "Friend or Family" && (
                    <form.Field
                      name="primaryEmail"
                      children={(field) => (
                        <Field
                          data-invalid={
                            field.state.meta.isTouched && !field.state.meta.isValid
                          }
                        >
                          <Label htmlFor={field.name}>
                            Primary email<span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={
                              field.state.meta.isTouched && !field.state.meta.isValid
                            }
                            required
                            placeholder="friend@example.com"
                            autoComplete="off"
                          />
                          {field.state.meta.isTouched && !field.state.meta.isValid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )}
                    />
                  )}
                  {["Friend or Family", "Other", "Testing"].includes(usage) && (
                    <form.Field
                      name="reason"
                      children={(field) => (
                        <Field
                          data-invalid={
                            field.state.meta.isTouched && !field.state.meta.isValid
                          }
                        >
                          <Label htmlFor={field.name}>
                            Reason<span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={
                              field.state.meta.isTouched && !field.state.meta.isValid
                            }
                            required
                            placeholder="Explain the intended use"
                          />
                          {field.state.meta.isTouched && !field.state.meta.isValid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )}
                    />
                  )}
                </>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="email-request-form"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
