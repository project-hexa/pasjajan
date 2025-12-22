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
            config(['mail.default' => 'smtp']);

            $configured = config('mail.mailers.resend.transport') === 'smtp';

            if (!$configured) {
                throw new Exception('Resend mailer not properly configured');
            }

            return $this->sendSuccessResponse('Resend connection successful!');

        } catch (Exception $e) {
            $errors['error_test'] = $e->getMessage();

            return $this->sendFailResponse('Resend connection failed.', $errors);
        }
    }

    public function testResendConnectionOnly(Request $request): JsonResponse
    {
        try {
            config(['mail.default' => 'resend']);

            $configured = config('mail.mailers.resend.transport') === 'resend';

            if (!$configured) {
                throw new Exception('Resend mailer not properly configured');
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
