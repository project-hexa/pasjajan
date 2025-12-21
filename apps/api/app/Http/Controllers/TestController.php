<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;
use Exception;

class TestController extends BaseController
{
    public function testSMTPConnectionOnly(Request $request): JsonResponse
    {
        try {
            // Get the default mailer (or 'smtp' specifically)
            $mailer = Mail::mailer('smtp');

            // Get the underlying transport
            $transport = $mailer->getSymfonyTransport();

            // Try to start the transport (this checks connection and authentication)
            $transport->start();

			return $this->sendSuccessResponse('SMTP connection successful!');

        } catch (Exception $e) {
			$errors['error_test'] = $e->getMessage();

			return $this->sendFailResponse('SMTP connection failed.', $errors);
        }
    }

    public function testResendConnectionOnly(Request $request): JsonResponse
    {
        try {
            // Get the default mailer (or 'smtp' specifically)
            $mailer = Mail::mailer('resend');

            // Get the underlying transport
            $transport = $mailer->getSymfonyTransport();

            // Try to start the transport (this checks connection and authentication)
            $transport->start();

			return $this->sendSuccessResponse('Resend connection successful!');

        } catch (Exception $e) {
			$errors['error_test'] = $e->getMessage();

			return $this->sendFailResponse('Resend connection failed.', $errors);
        }
    }

	public function testSendEmail(Request $request): JsonResponse
	{
		try {
			// Ambil email dari inputan
			$email = $request->input('email');

			// Tetapkan isi konten pada badan email/chat/sms
			$content = "Test kirim email ke alamat email.";

			// Mengirim otp ke alamat email milik user terkait
			Mail::raw($content, function ($message) use ($email) {
				$message->to($email)->subject('Test Email');
			});

			$result['email'] = $email;

			return $this->sendSuccessResponse("Test kirim email berhasil.", $result);
		} catch (Exception $e) {
			$errors['error_test'] = $e->getMessage();

			return $this->sendSuccessResponse("Test kirim emaill gagal.", $errors);
		}
	}
}
