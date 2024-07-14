import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { ZodType } from 'zod';
import { OrderHistory, OrderHistoryList } from '../models/order-history.model';
import { orderHistoryDtoSchema, orderHistoryListDtoSchema } from '../dto/order-history.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

const ORDER_HISTORY_URL = environment.apiUrl + 'orders/';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly translate: TranslateService
    ) {}

    public getOrderHistoryList(): Observable<OrderHistoryList> {
        return this.httpClient
            .get<OrderHistoryList>(ORDER_HISTORY_URL)
            .pipe(map((response) => this.checkSchema(response, orderHistoryListDtoSchema)));
    }

    public editOrderHistoryItem(
        orderId: OrderHistory['id'],
        order: Partial<Omit<OrderHistory, 'id'>>
    ): Observable<OrderHistory> {
        return this.httpClient
            .put<OrderHistory>(ORDER_HISTORY_URL + orderId, order)
            .pipe(map((response) => this.checkSchema(response, orderHistoryDtoSchema)));
    }

    public deleteOrderHistoryItem(orderId: OrderHistory['id']): Observable<OrderHistory> {
        return this.httpClient
            .delete<OrderHistory>(ORDER_HISTORY_URL + orderId)
            .pipe(map((response) => this.checkSchema(response, orderHistoryDtoSchema)));
    }

    public addOrderHistoryItem(order: Omit<OrderHistory, 'id'>): Observable<OrderHistory> {
        return this.httpClient
            .post<OrderHistory>(ORDER_HISTORY_URL, order)
            .pipe(map((response) => this.checkSchema(response, orderHistoryDtoSchema)));
    }

    private checkSchema<T, U extends ZodType<T>>(data: T, schema: U): T {
        const parseResult = schema.safeParse(data);
        if (parseResult.success) {
            return parseResult.data;
        } else {
            throw new Error('[ZOD] Invalid response' + parseResult.error.message, parseResult.error);
        }
    }

    public openSnackbar(messageKey: string, isSuccess = true): void {
        const translatedMessage = this.translate.instant(messageKey) as string | undefined;

        let message: string;
        if (typeof translatedMessage === 'string') {
            message = translatedMessage;
        } else {
            message = isSuccess ? 'Operation was successful' : 'Something went wrong';
        }

        this.snackBar.open(message, 'OK', {
            panelClass: isSuccess ? 'green-snackbar' : 'red-snackbar',
            duration: 10000
        });
    }
}
