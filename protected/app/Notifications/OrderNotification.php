<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;

class OrderNotification extends Notification
{
    use Queueable;
    private $channel;
    private $status;
    private $order_number;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($status, $channel, $order_number)
    {
        $this->status = $status;
        $this->channel = $channel;
        $this->order_number = $order_number;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['slack'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return slack
     */
    public function toSlack($notifiable)
    {
        $order_number = $this->order_number;
        $status = $this->status;

        return (new SlackMessage)
            ->from('Ghost', ':ghost:')
            ->to($this->channel)
            ->content('Order status changed')
            ->attachment(function ($attachment) use ($order_number, $status) {
                $attachment->fields([
                        'Order' => '#'.$order_number,
                        'Status' => $status
                    ]);
    });
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
