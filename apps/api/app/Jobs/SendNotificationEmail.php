<?php

namespace App\Jobs;

use App\Mail\NotificationMail;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNotificationEmail implements ShouldQueue
{
    use Queueable, Batchable;

    public string $title;
    public string $body;
    public string $fromUserName;
    public array $recipients;

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
        array $recipients
    ) {
        $this->title = $title;
        $this->body = $body;
        $this->fromUserName = $fromUserName;
        $this->recipients = $recipients;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        foreach ($this->recipients as $recipient) {
            try {
                Mail::to($recipient['email'])->send(
                    new NotificationMail($this->title, $this->body, $this->fromUserName)
                );
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email notifikasi di queue', [
                    'to' => $recipient['email'],
                    'recipient_name' => $recipient['name'],
                    'title' => $this->title,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Job SendNotificationEmail gagal setelah semua retry', [
            'title' => $this->title,
            'batch_size' => count($this->recipients),
            'error' => $exception->getMessage()
        ]);
    }
}
