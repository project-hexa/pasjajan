"use client";

import { sendEmailNotificationSchema } from "@/lib/schema/notifications.schema";
import { sendEmailNotification } from "@/services/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";
import { useNotificationsStore } from "@/stores/useNotificationsStore";

export default function NotificationsForm() {
  const triggerRefresh = useNotificationsStore((state) => state.triggerRefresh);
  const form = useForm<z.infer<typeof sendEmailNotificationSchema>>({
    resolver: zodResolver(sendEmailNotificationSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof sendEmailNotificationSchema>) {
    try {
      await sendEmailNotification({
        title: values.title,
        body: values.body,
      });
      toast.success("Notifikasi berhasil dikirim!", {
        toasterId: "global",
      });
      form.reset();
      triggerRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim notifikasi",
        {
          toasterId: "global",
        },
      );
    }
  }

  return (
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control as any}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Judul notifikasi"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Notifikasi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Isi notifikasi"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Mengirim..." : "Kirim Notifikasi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
