interface EmailNotificationBody {
  title: string;
  body: string;
}

export const sendEmailNotification = async ({
  title,
  body,
}: EmailNotificationBody) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ title, body }),
    },
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Gagal mengirim notifikasi email.");
  }
};
