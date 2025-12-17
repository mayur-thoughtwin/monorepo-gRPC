declare class KafkaProducer {
    private producer;
    private kafka;
    private isConnected;
    private connectionPromise;
    constructor();
    connect(): Promise<void>;
    private _connect;
    disconnect(): Promise<void>;
    send<T>(topic: string, event: string, data: T, source: string, key?: string): Promise<string>;
    sendWithCorrelation<T>(topic: string, event: string, data: T, source: string, correlationId: string): Promise<void>;
    sendBatch<T>(topic: string, messages: Array<{
        event: string;
        data: T;
        key?: string;
    }>, source: string): Promise<string[]>;
    healthCheck(): Promise<boolean>;
    getStatus(): {
        connected: boolean;
    };
}
export declare const kafkaProducer: KafkaProducer;
export { KafkaProducer };
//# sourceMappingURL=producer.d.ts.map