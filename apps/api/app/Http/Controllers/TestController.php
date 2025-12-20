<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Swift_SmtpTransport;
use Swift_TransportException;
use Exception;

class TestController extends Controller
{
    public function testSMTPConnection(Request $request)
    {
        $mailConfig = config('mail.mailers.smtp');

        try {
            // Create Swift SMTP Transport
            $transport = new Swift_SmtpTransport(
                $mailConfig['host'], 
                $mailConfig['port'], 
                $mailConfig['encryption']
            );

            $transport->setUsername($mailConfig['username']);
            $transport->setPassword($mailConfig['password']);

            // Try to start the transport
            $transport->start();

            return response()->json([
                'status' => 'success',
                'message' => 'SMTP connection successful!'
            ]);

        } catch (Swift_TransportException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'SMTP connection failed: '.$e->getMessage()
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unexpected error: '.$e->getMessage()
            ]);
        }
    }
}
