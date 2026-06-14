# Finance

The Finance module handles all monetary transactions, accounting records, and payment processing for the platform. It integrates directly with Stripe for card processing and maintains a full double-entry-adjacent ledger of invoices, payments, bills, and journal entries.

## What it covers

| Section | Description |
|---|---|
| **Customer Payment Processing** | Collect and record customer payments via Stripe |
| **Contractor Payment Processing** | Initiate and track outbound contractor/vendor payments |
| **Stripe Integration** | Low-level Stripe API operations (PaymentIntents, Customers, etc.) |
| **Invoices** | Generate and manage customer invoices |
| **Estimates** | Pre-invoice cost estimates and quotes |
| **Bills** | Vendor/supplier bills payable |
| **Payments** | General payment records (inbound and outbound) |
| **Credit Memos** | Issued credits against invoices |
| **Sales Receipts** | Point-of-sale or immediate-payment receipts |
| **Journal Entries** | Manual double-entry accounting adjustments |
| **Customers** | Finance-side customer records (distinct from Sales contacts) |
| **Vendors** | Supplier and contractor records |
| **Employees** | Payroll-eligible employee records |
| **Finance Accounts** | Chart of accounts (e.g. Revenue, COGS, Accounts Receivable) |
| **Product Services** | Billable product/service line items |

## Authentication

All Finance endpoints require authentication. Payment processing endpoints additionally require the `finance:write` permission.

## Core services

### Customer Payment Processing

Accepts payment data, creates a Stripe PaymentIntent, and records the result in the `customerPayments` model.

```http
POST /api/finance/customer-payments/process
Content-Type: application/json

{
  "amount": 4800,
  "currency": "usd",
  "customerId": "<customer_id>",
  "invoiceId": "<invoice_id>",
  "paymentMethodId": "pm_card_visa"
}
```

**Response** includes `stripePaymentIntentId`, `stripeClientSecret` (for client-side confirmation if needed), and a `status` field:

| Stripe status | Recorded status |
|---|---|
| `succeeded` | `completed` |
| `requires_payment_method` | `pending` |
| Other | `failed` |

### Stripe Integration

Direct Stripe operations — use when you need to manage Stripe objects not covered by the higher-level payment processing endpoints.

```http
POST /api/finance/stripe/create-customer
POST /api/finance/stripe/create-payment-intent
POST /api/finance/stripe/refund
GET  /api/finance/stripe/payment-methods/{customerId}
```

### Contractor Payment Processing

Tracks outbound payments to contractors and freelancers.

```http
POST /api/finance/contractor-payments/process
{
  "contractorId": "<id>",
  "amount": 2500,
  "currency": "usd",
  "description": "May 2026 invoice"
}
```

## Data models

All Finance models at `/api/finance/{model}`:

| Model | Slug |
|---|---|
| Finance Accounts | `financeAccounts` |
| Finance Bills | `financeBills` |
| Finance Credit Memos | `financeCreditMemos` |
| Finance Customers | `financeCustomers` |
| Finance Employees | `financeEmployees` |
| Finance Estimates | `financeEstimates` |
| Finance Invoices | `financeInvoices` |
| Finance Journal Entries | `financeJournalEntries` |
| Finance Payments | `financePayments` |
| Finance Product Services | `financeProductServices` |
| Finance Sales Receipts | `financeSalesReceipts` |
| Finance Vendors | `financeVendors` |

## Common patterns

### Creating and sending an invoice

```http
# 1. Create the invoice
POST /api/finance/financeInvoices
{
  "customerId": "<id>",
  "lineItems": [
    { "description": "Platform licence — Q3 2026", "amount": 4800, "quantity": 1 }
  ],
  "dueDate": "2026-07-31"
}

# 2. Record payment when received
POST /api/finance/customer-payments/process
{
  "invoiceId": "<invoice_id>",
  "amount": 4800,
  "currency": "usd",
  "paymentMethodId": "pm_card_visa"
}
```

### Querying unpaid invoices

```http
GET /api/finance/financeInvoices?filter[status]=unpaid&sort=dueDate
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Finance API Reference**:

- [Contractor Payment Processing](/api/finance)
- [Customer Payment Processing](/api/finance)
- [Customer Payments](/api/finance)
- [Finance Accounts](/api/finance)
- [Finance Bills](/api/finance)
- [Finance Credit Memos](/api/finance)
- [Finance Customers](/api/finance)
- [Finance Employees](/api/finance)
- [Finance Estimates](/api/finance)
- [Finance Invoices](/api/finance)
- [Finance Journal Entries](/api/finance)
- [Finance Payments](/api/finance)
- [Finance Product Services](/api/finance)
- [Finance Sales Receipts](/api/finance)
- [Finance Vendors](/api/finance)
- [Stripe Integration](/api/finance)
<!-- api-sections-end -->
