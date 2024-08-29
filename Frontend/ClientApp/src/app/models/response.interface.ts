import { ResposeDataLogin } from "./response-data-login";

export interface ResponseI {
    IsValid:    boolean;
    Warnings:   any[];
    Errors:     any[];
    ResultData: ResposeDataLogin;
    ResultCode: number;
}
