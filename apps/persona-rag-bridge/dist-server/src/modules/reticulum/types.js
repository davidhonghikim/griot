"use strict";
/**
 * Reticulum Encrypted Communication Types
 *
 * Defines the types and interfaces for the Reticulum mesh network
 * communication system with end-to-end encryption.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReticulumErrorCode = exports.ReticulumError = exports.ReticulumEventType = exports.ReticulumPacketType = void 0;
var ReticulumPacketType;
(function (ReticulumPacketType) {
    ReticulumPacketType[ReticulumPacketType["DATA"] = 1] = "DATA";
    ReticulumPacketType[ReticulumPacketType["CONTROL"] = 2] = "CONTROL";
    ReticulumPacketType[ReticulumPacketType["DISCOVERY"] = 3] = "DISCOVERY";
    ReticulumPacketType[ReticulumPacketType["ROUTING"] = 4] = "ROUTING";
    ReticulumPacketType[ReticulumPacketType["ENCRYPTED"] = 5] = "ENCRYPTED";
    ReticulumPacketType[ReticulumPacketType["FRAGMENT"] = 6] = "FRAGMENT";
})(ReticulumPacketType || (exports.ReticulumPacketType = ReticulumPacketType = {}));
var ReticulumEventType;
(function (ReticulumEventType) {
    ReticulumEventType["NODE_DISCOVERED"] = "node_discovered";
    ReticulumEventType["NODE_LOST"] = "node_lost";
    ReticulumEventType["MESSAGE_RECEIVED"] = "message_received";
    ReticulumEventType["MESSAGE_SENT"] = "message_sent";
    ReticulumEventType["CONNECTION_ESTABLISHED"] = "connection_established";
    ReticulumEventType["CONNECTION_LOST"] = "connection_lost";
    ReticulumEventType["ROUTE_ADDED"] = "route_added";
    ReticulumEventType["ROUTE_REMOVED"] = "route_removed";
    ReticulumEventType["ENCRYPTION_KEY_EXCHANGED"] = "encryption_key_exchanged";
    ReticulumEventType["ERROR"] = "error";
})(ReticulumEventType || (exports.ReticulumEventType = ReticulumEventType = {}));
// =============================================================================
// ERROR TYPES
// =============================================================================
class ReticulumError extends Error {
    constructor(message, code, details) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: details
        });
        this.name = 'ReticulumError';
    }
}
exports.ReticulumError = ReticulumError;
var ReticulumErrorCode;
(function (ReticulumErrorCode) {
    ReticulumErrorCode["NODE_NOT_FOUND"] = "NODE_NOT_FOUND";
    ReticulumErrorCode["ROUTE_NOT_FOUND"] = "ROUTE_NOT_FOUND";
    ReticulumErrorCode["CONNECTION_FAILED"] = "CONNECTION_FAILED";
    ReticulumErrorCode["ENCRYPTION_FAILED"] = "ENCRYPTION_FAILED";
    ReticulumErrorCode["DECRYPTION_FAILED"] = "DECRYPTION_FAILED";
    ReticulumErrorCode["KEY_EXCHANGE_FAILED"] = "KEY_EXCHANGE_FAILED";
    ReticulumErrorCode["MESSAGE_TOO_LARGE"] = "MESSAGE_TOO_LARGE";
    ReticulumErrorCode["TIMEOUT"] = "TIMEOUT";
    ReticulumErrorCode["INVALID_MESSAGE"] = "INVALID_MESSAGE";
    ReticulumErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
})(ReticulumErrorCode || (exports.ReticulumErrorCode = ReticulumErrorCode = {}));
