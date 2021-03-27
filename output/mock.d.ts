import { IncomingMessage, OutgoingMessage } from 'http';
export interface MockOption {
    dbPath: string;
    routesPath: string;
}
export declare function mock(op: MockOption): (req: IncomingMessage, res: OutgoingMessage, next: () => void) => void;
