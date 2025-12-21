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

			// Docblock to help static analyzers (mailer implementation may vary)
			/** @var mixed $mailer */

			// Get the underlying transport (guarded: implementations differ between Laravel versions)
			$transport = null;
			if (method_exists($mailer, 'getSymfonyTransport')) {
				$transport = $mailer->getSymfonyTransport();
			} elseif (method_exists($mailer, 'getTransport')) {
				$transport = $mailer->getTransport();
			}

			// Try to start the transport (this checks connection and authentication)
			if ($transport && method_exists($transport, 'start')) {
				$transport->start();
			} else {
				throw new Exception('Transport start method not available');
			}

			return $this->sendSuccessResponse('SMTP connection successful!');

        } catch (Exception $e) {
			$errors['error_test'] = $e->getMessage();

			return $this->sendFailResponse('SMTP connection failed.', $errors);
        }
    }

    public function testResendConnectionOnly(Request $request): JsonResponse
    {
        try {
			// Get the default mailer (or 'resend' specifically)
			$mailer = Mail::mailer('resend');

			// Docblock to help static analyzers (mailer implementation may vary)
			/** @var mixed $mailer */

			// Get the underlying transport (guarded: implementations differ between Laravel versions)
			$transport = null;
			if (method_exists($mailer, 'getSymfonyTransport')) {
				$transport = $mailer->getSymfonyTransport();
			} elseif (method_exists($mailer, 'getTransport')) {
				$transport = $mailer->getTransport();
			}

			// Try to start the transport (this checks connection and authentication)
			if ($transport && method_exists($transport, 'start')) {
				$transport->start();
			} else {
				throw new Exception('Transport start method not available');
			}

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
