---
title: Javaデザインパターン：Strategyパターン完全解説
description: GoFの行動パターンの一つであるStrategyパターンを、Javaのコードサンプルとともに詳しく解説します。
publishDate: 2026-05-15
category: Java Design Patterns
tags: [java, design-patterns, strategy, oop]
order: 1
---

<h2>Strategyパターンとは</h2>

<p>
  <strong>Strategyパターン</strong>は、アルゴリズムのファミリを定義し、それぞれをカプセル化して交換可能にするデザインパターンです。
  GoF（Gang of Four）の<em>行動パターン（Behavioral Pattern）</em>に分類されます。
</p>

<blockquote>
  <p>「アルゴリズムを使うクライアントから独立して、アルゴリズムを変えられるようにする。」— GoF</p>
</blockquote>

<h2>問題：if-else地獄</h2>

<p>Strategyパターンを使わない場合、こんなコードになりがちです：</p>

```java
// アンチパターン: if-else地獄
public class PaymentProcessor {
    public void processPayment(String paymentType, double amount) {
        if (paymentType.equals("CREDIT_CARD")) {
            // クレジットカード処理
            System.out.println("クレジットカードで " + amount + "円 支払い");
        } else if (paymentType.equals("PAYPAL")) {
            // PayPal処理
            System.out.println("PayPalで " + amount + "円 支払い");
        } else if (paymentType.equals("CRYPTO")) {
            // 仮想通貨処理
            System.out.println("仮想通貨で " + amount + "円 支払い");
        }
        // 新しい支払い方法が増えるたびにここを変更する必要がある...
    }
}
```

<p>新しい支払い方法が追加されるたびに、このクラスを変更しなければなりません。<strong>開放閉鎖原則（OCP）</strong>に違反しています。</p>

<h2>解決：Strategyパターンの実装</h2>

<h3>Step 1: Strategy インターフェースを定義</h3>

```java
// Strategy インターフェース
public interface PaymentStrategy {
    void pay(double amount);
    String getPaymentMethodName();
}
```

<h3>Step 2: 具体的な Strategy を実装</h3>

```java
// Concrete Strategy 1: クレジットカード
public class CreditCardStrategy implements PaymentStrategy {
    private final String cardNumber;
    private final String cardHolder;

    public CreditCardStrategy(String cardNumber, String cardHolder) {
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
    }

    @Override
    public void pay(double amount) {
        System.out.printf("クレジットカード [%s] で %.0f円 支払い%n",
            maskCardNumber(cardNumber), amount);
    }

    @Override
    public String getPaymentMethodName() {
        return "Credit Card";
    }

    private String maskCardNumber(String number) {
        return "**** **** **** " + number.substring(number.length() - 4);
    }
}
```

```java
// Concrete Strategy 2: PayPal
public class PayPalStrategy implements PaymentStrategy {
    private final String email;

    public PayPalStrategy(String email) {
        this.email = email;
    }

    @Override
    public void pay(double amount) {
        System.out.printf("PayPal [%s] で %.0f円 支払い%n", email, amount);
    }

    @Override
    public String getPaymentMethodName() {
        return "PayPal";
    }
}
```

```java
// Concrete Strategy 3: 仮想通貨
public class CryptoStrategy implements PaymentStrategy {
    private final String walletAddress;

    public CryptoStrategy(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    @Override
    public void pay(double amount) {
        System.out.printf("仮想通貨 [%s...] で %.0f円 相当 支払い%n",
            walletAddress.substring(0, 8), amount);
    }

    @Override
    public String getPaymentMethodName() {
        return "Crypto";
    }
}
```

<h3>Step 3: Context クラス（Strategy を使う側）</h3>

```java
// Context クラス
public class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    private final List<Item> items = new ArrayList<>();

    // Strategy を注入（依存性の注入）
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public void checkout() {
        if (paymentStrategy == null) {
            throw new IllegalStateException("支払い方法が設定されていません");
        }
        double total = items.stream()
            .mapToDouble(Item::getPrice)
            .sum();

        System.out.println("=== 注文確認 ===");
        System.out.println("合計: " + total + "円");
        System.out.println("支払い方法: " + paymentStrategy.getPaymentMethodName());

        paymentStrategy.pay(total);
        items.clear();
    }
}
```

<h3>Step 4: 実際の使用例</h3>

```java
public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.addItem(new Item("Javaプログラミング入門", 3000));
        cart.addItem(new Item("デザインパターン解説本", 4500));

        // クレジットカードで支払い
        cart.setPaymentStrategy(
            new CreditCardStrategy("1234567890123456", "Zhong Tao")
        );
        cart.checkout();

        // 注文2件目: PayPalで支払い（戦略を切り替え）
        cart.addItem(new Item("アジャイル実践ガイド", 2800));
        cart.setPaymentStrategy(new PayPalStrategy("zhongtao@example.com"));
        cart.checkout();
    }
}
```

<p>出力結果:</p>

<pre><code>=== 注文確認 ===
合計: 7500円
支払い方法: Credit Card
クレジットカード [**** **** **** 3456] で 7500円 支払い
=== 注文確認 ===
合計: 2800円
支払い方法: PayPal
PayPal [zhongtao@example.com] で 2800円 支払い</code></pre>

<h2>UML クラス図</h2>

<pre><code>┌─────────────────┐        ┌──────────────────────┐
│   ShoppingCart  │───────▶│   PaymentStrategy    │
│   (Context)     │ uses   │   <<interface>>       │
├─────────────────┤        ├──────────────────────┤
│ -strategy       │        │ +pay(amount)         │
│ -items          │        │ +getPaymentMethodName│
├─────────────────┤        └──────────┬───────────┘
│ +setStrategy()  │                   │ implements
│ +checkout()     │         ┌─────────┼─────────┐
└─────────────────┘         ▼         ▼         ▼
                    ┌──────────┐ ┌────────┐ ┌────────┐
                    │CreditCard│ │PayPal  │ │Crypto  │
                    │Strategy  │ │Strategy│ │Strategy│
                    └──────────┘ └────────┘ └────────┘</code></pre>

<h2>Strategyパターンのメリット・デメリット</h2>

<table>
  <thead>
    <tr>
      <th>メリット</th>
      <th>デメリット</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OCP準拠：新しいStrategyを追加してもContextを変更不要</td>
      <td>Strategyクラスが多くなる可能性がある</td>
    </tr>
    <tr>
      <td>単一責任：各Strategyは1つのアルゴリズムのみ実装</td>
      <td>クライアントが全Strategyを知る必要がある</td>
    </tr>
    <tr>
      <td>テストしやすい：各Strategyを独立してテスト可能</td>
      <td>シンプルなケースではオーバーエンジニアリングになることも</td>
    </tr>
    <tr>
      <td>実行時に動的に戦略を切り替えられる</td>
      <td>—</td>
    </tr>
  </tbody>
</table>

<h2>実際のJavaライブラリでの使用例</h2>

<ul>
  <li><code>java.util.Comparator</code> — ソートアルゴリズムのStrategy</li>
  <li><code>javax.servlet.http.HttpServlet</code> — HTTPメソッドごとの処理がStrategy</li>
  <li>Spring Security の <code>AuthenticationStrategy</code></li>
</ul>

<h2>まとめ</h2>

<p>
  Strategyパターンは、<strong>「振る舞いを変えたい」</strong>ときに最初に思い出すべきパターンです。
  if-else地獄を解消し、Open/Closed Principleを守りながら柔軟なコードを実現できます。
  Javaの関数型インターフェース（<code>@FunctionalInterface</code>）と組み合わせることで、
  さらにシンプルに実装することも可能です。
</p>
