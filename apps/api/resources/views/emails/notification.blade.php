<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-body h2 {
            color: #667eea;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .email-body p {
            color: #555555;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 15px;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }
        .email-footer p {
            margin: 5px 0;
        }
        .sender-info {
            color: #888888;
            font-size: 14px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Notifikasi dari PasJajan</h1>
        </div>
        
        <div class="email-body">
            <h2>{{ $title }}</h2>
            <p>{{ $body }}</p>
            
            <div class="sender-info">
                <p><strong>Dikirim oleh:</strong> {{ $fromUserName }}</p>
                <p><strong>Tanggal:</strong> {{ now()->timezone('Asia/Jakarta')->format('d M Y H:i') }} WIB</p>
            </div>
        </div>
        
        <div class="email-footer">
            <p><strong>PasJajan</strong></p>
            <p>Platform Jajan Online Terpercaya</p>
            <p style="font-size: 12px; color: #999999; margin-top: 10px;">
                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
            </p>
        </div>
    </div>
</body>
</html>
