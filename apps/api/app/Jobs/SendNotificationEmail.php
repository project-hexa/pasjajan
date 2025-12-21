<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNotificationEmail implements ShouldQueue
{
    use Queueable;

    public string $title;
    public string $body;
    public string $fromUserName;
    public string $recipientEmail;
    public string $recipientName;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        string $title,
        string $body,
        string $fromUserName,
        string $recipientEmail,
        string $recipientName
    ) {
        $this->title = $title;
        $this->body = $body;
        $this->fromUserName = $fromUserName;
        $this->recipientEmail = $recipientEmail;
        $this->recipientName = $recipientName;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->recipientEmail)->send(
                new NotificationMail($this->title, $this->body, $this->fromUserName)
            );

            Log::info('Email notifikasi berhasil dikirim', [
                'to' => $this->recipientEmail,
                'recipient_name' => $this->recipientName,
                'title' => $this->title
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email notifikasi di queue', [
                'to' => $this->recipientEmail,
                'recipient_name' => $this->recipientName,
                'title' => $this->title,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Job SendNotificationEmail gagal setelah semua retry', [
            'to' => $this->recipientEmail,
            'recipient_name' => $this->recipientName,
            'title' => $this->title,
            'error' => $exception->getMessage()
        ]);
    }
}
