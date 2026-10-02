import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField } from "@/components/ui/form";

afterEach(cleanup);

// @saastro/forms monta así cada campo (FieldWrapper.tsx): FormField con render
// prop y FormControl alrededor del input, SIN FormItem. El borde rojo de los
// inputs (`aria-invalid:border-destructive`) depende de que FormControl ponga
// aria-invalid en el input cuando el campo tiene error.
function Campo({ conError }: { conError: boolean }) {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
  React.useEffect(() => {
    if (conError)
      form.setError("email", { type: "required", message: "Obligatorio" });
  }, [conError, form]);
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormControl>
          <input aria-label="email" {...field} />
        </FormControl>
      )}
    />
  );
}

describe("FormControl · aria-invalid", () => {
  it('un campo con error lleva aria-invalid="true" en el input', async () => {
    await act(async () => {
      render(<Campo conError />);
    });
    expect(screen.getByLabelText("email").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("un campo sin error no lleva aria-invalid", async () => {
    await act(async () => {
      render(<Campo conError={false} />);
    });
    expect(screen.getByLabelText("email").hasAttribute("aria-invalid")).toBe(
      false,
    );
  });

  it("aria-invalid explícito en FormControl gana al del FormField", async () => {
    function Explicito() {
      const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
      React.useEffect(() => {
        form.setError("email", { type: "required", message: "Obligatorio" });
      }, [form]);
      return (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormControl aria-invalid={false}>
              <input aria-label="email" {...field} />
            </FormControl>
          )}
        />
      );
    }
    await act(async () => {
      render(<Explicito />);
    });
    expect(screen.getByLabelText("email").getAttribute("aria-invalid")).toBe(
      "false",
    );
  });

  it("dentro de <Form> (FormProvider) también funciona", async () => {
    function ConProvider() {
      const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
      React.useEffect(() => {
        form.setError("email", { type: "required", message: "Obligatorio" });
      }, [form]);
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormControl>
                <input aria-label="email" {...field} />
              </FormControl>
            )}
          />
        </Form>
      );
    }
    await act(async () => {
      render(<ConProvider />);
    });
    expect(screen.getByLabelText("email").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });
});
