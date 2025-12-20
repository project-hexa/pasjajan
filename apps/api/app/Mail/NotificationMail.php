<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
  use Queueable, SerializesModels;

  public string $title;
  public string $body;
  public ?string $fromUserName;

  /**
   * Create a new message instance.
   */
  public function __construct(string $title, string $body, ?string $fromUserName = null)
  {
    $this->title = $title;
    $this->body = $body;
    $this->fromUserName = $fromUserName ?? 'PasJajan';
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: $this->title,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.notification',
      with: [
        'title' => $this->title,
        'body' => $this->body,
        'fromUserName' => $this->fromUserName,
      ],
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
