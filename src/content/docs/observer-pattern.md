---
title: Javaデザインパターン：Observerパターン完全解説
description: GoFの行動パターンの一つであるObserverパターンを、イベント駆動設計の観点からJavaコードで詳しく解説します。
publishDate: 2026-05-26
category: Java Design Patterns
tags: [java, design-patterns, observer, oop, event-driven]
order: 2
---

<h2>Observerパターンとは</h2>

<p>
  <strong>Observerパターン</strong>は、あるオブジェクト（Subject）の状態が変わったとき、
  そのオブジェクトに依存する複数のオブジェクト（Observer）に自動的に通知するパターンです。
  GoFの<em>行動パターン（Behavioral Pattern）</em>に分類されます。
</p>

<blockquote>
  <p>「オブジェクト間の1対多の依存関係を定義する。あるオブジェクトの状態が変化すると、
  依存するすべてのオブジェクトに自動的に通知され、更新される。」— GoF</p>
</blockquote>

<h2>問題：密結合な通知処理</h2>

<p>Observerパターンを使わない場合、通知処理がこのように密結合になります：</p>

```java
// アンチパターン: 通知先を直接呼び出している
public class StockPrice {
    private double price;
    private EmailAlert emailAlert = new EmailAlert();
    private MobileApp mobileApp = new MobileApp();
    private Dashboard dashboard = new Dashboard();

    public void setPrice(double newPrice) {
        this.price = newPrice;
        // 通知先が増えるたびにここを変更しなければならない
        emailAlert.notify(newPrice);
        mobileApp.notify(newPrice);
        dashboard.notify(newPrice);
    }
}
```

<p>
  通知先が1つ増えるたびに <code>StockPrice</code> を変更する必要があります。
  <strong>開放閉鎖原則（OCP）</strong>に違反し、テストも困難です。
</p>

<h2>解決：Observerパターンの実装</h2>

<h3>Step 1: Observer インターフェースを定義</h3>

```java
// Observer インターフェース
public interface StockObserver {
    void update(String stockSymbol, double oldPrice, double newPrice);
}
```

<h3>Step 2: Subject インターフェースを定義</h3>

```java
// Subject インターフェース
public interface StockSubject {
    void addObserver(StockObserver observer);
    void removeObserver(StockObserver observer);
    void notifyObservers();
}
```

<h3>Step 3: Concrete Subject を実装</h3>

```java
// Concrete Subject: 株価
public class StockMarket implements StockSubject {
    private final List<StockObserver> observers = new ArrayList<>();
    private final Map<String, Double> stockPrices = new HashMap<>();

    @Override
    public void addObserver(StockObserver observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(StockObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        // 実装は updatePrice() 内で行う
    }

    public void updatePrice(String symbol, double newPrice) {
        double oldPrice = stockPrices.getOrDefault(symbol, 0.0);
        stockPrices.put(symbol, newPrice);

        // すべての Observer に通知
        for (StockObserver observer : observers) {
            observer.update(symbol, oldPrice, newPrice);
        }
    }

    public double getPrice(String symbol) {
        return stockPrices.getOrDefault(symbol, 0.0);
    }
}
```

<h3>Step 4: Concrete Observer を実装</h3>

```java
// Concrete Observer 1: メールアラート
public class EmailAlertObserver implements StockObserver {
    private final String email;
    private final double threshold; // 変動率の閾値 (%)

    public EmailAlertObserver(String email, double threshold) {
        this.email = email;
        this.threshold = threshold;
    }

    @Override
    public void update(String symbol, double oldPrice, double newPrice) {
        if (oldPrice == 0) return;
        double changeRate = Math.abs((newPrice - oldPrice) / oldPrice * 100);

        if (changeRate >= threshold) {
            System.out.printf("[EMAIL → %s] %s が %.1f%% 変動: %.2f → %.2f%n",
                email, symbol, changeRate, oldPrice, newPrice);
        }
    }
}
```

```java
// Concrete Observer 2: モバイルプッシュ通知
public class MobilePushObserver implements StockObserver {
    private final String deviceId;

    public MobilePushObserver(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void update(String symbol, double oldPrice, double newPrice) {
        String direction = newPrice > oldPrice ? "↑" : "↓";
        System.out.printf("[PUSH → %s] %s %s %.2f円%n",
            deviceId, symbol, direction, newPrice);
    }
}
```

```java
// Concrete Observer 3: ダッシュボード（リアルタイム表示）
public class DashboardObserver implements StockObserver {
    private final Map<String, Double> displayedPrices = new HashMap<>();

    @Override
    public void update(String symbol, double oldPrice, double newPrice) {
        displayedPrices.put(symbol, newPrice);
        System.out.printf("[DASHBOARD] %s: %.2f円 (前回: %.2f円)%n",
            symbol, newPrice, oldPrice);
    }

    public void printAll() {
        System.out.println("=== 現在の株価一覧 ===");
        displayedPrices.forEach((symbol, price) ->
            System.out.printf("  %s: %.2f円%n", symbol, price));
    }
}
```

<h3>Step 5: 実際の使用例</h3>

```java
public class Main {
    public static void main(String[] args) {
        StockMarket market = new StockMarket();

        // Observer を登録
        EmailAlertObserver emailAlert =
            new EmailAlertObserver("zhongtao@example.com", 5.0); // 5%以上変動でメール
        MobilePushObserver mobilePush = new MobilePushObserver("iPhone-XYZ");
        DashboardObserver dashboard = new DashboardObserver();

        market.addObserver(emailAlert);
        market.addObserver(mobilePush);
        market.addObserver(dashboard);

        // 株価を更新 → 全 Observer に自動通知
        System.out.println("--- トヨタ株価更新 ---");
        market.updatePrice("TOYOTA", 2850.00);

        System.out.println("\n--- ソニー株価更新（大幅変動）---");
        market.updatePrice("SONY", 12500.00);
        market.updatePrice("SONY", 13200.00); // 5.6%上昇 → メールが飛ぶ

        System.out.println("\n--- Observer の動的な削除 ---");
        market.removeObserver(mobilePush); // モバイル通知を解除
        market.updatePrice("TOYOTA", 2900.00); // mobilePush には通知されない

        System.out.println();
        dashboard.printAll();
    }
}
```

<p>出力結果:</p>

<pre><code>--- トヨタ株価更新 ---
[PUSH → iPhone-XYZ] TOYOTA ↑ 2850.00円
[DASHBOARD] TOYOTA: 2850.00円 (前回: 0.00円)

--- ソニー株価更新（大幅変動）---
[PUSH → iPhone-XYZ] SONY ↑ 12500.00円
[DASHBOARD] SONY: 12500.00円 (前回: 0.00円)
[EMAIL → zhongtao@example.com] SONY が 5.6% 変動: 12500.00 → 13200.00
[PUSH → iPhone-XYZ] SONY ↑ 13200.00円
[DASHBOARD] SONY: 13200.00円 (前回: 12500.00円)

--- Observer の動的な削除 ---
[EMAIL → zhongtao@example.com] TOYOTA が ... （閾値未達のため省略）
[DASHBOARD] TOYOTA: 2900.00円 (前回: 2850.00円)

=== 現在の株価一覧 ===
  TOYOTA: 2900.00円
  SONY: 13200.00円</code></pre>

<h2>UML クラス図</h2>

<pre><code>┌───────────────┐         ┌──────────────────────┐
│  StockMarket  │────────▶│   StockObserver      │
│  (Subject)    │ notifies│   <<interface>>       │
├───────────────┤         ├──────────────────────┤
│ -observers    │         │ +update(symbol,      │
│ -stockPrices  │         │   oldPrice, newPrice)│
├───────────────┤         └──────────┬───────────┘
│ +addObserver()│                    │ implements
│ +removeObs.() │          ┌─────────┼──────────┐
│ +updatePrice()│          ▼         ▼          ▼
└───────────────┘  ┌───────────┐ ┌────────┐ ┌──────────┐
                   │  Email    │ │Mobile  │ │Dashboard │
                   │  Alert    │ │Push    │ │Observer  │
                   └───────────┘ └────────┘ └──────────┘</code></pre>

<h2>Java 標準ライブラリとの関係</h2>

<p>
  Java 標準ライブラリにも Observer パターンの実装が組み込まれています。
  ただし、<code>java.util.Observer</code> と <code>java.util.Observable</code> は
  Java 9 で<strong>非推奨（Deprecated）</strong>になりました。
  現代の Java 開発では以下の代替を使用します。
</p>

<table>
  <thead>
    <tr>
      <th>用途</th>
      <th>推奨クラス/フレームワーク</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GUIイベント処理</td>
      <td><code>java.beans.PropertyChangeListener</code></td>
    </tr>
    <tr>
      <td>リアクティブストリーム</td>
      <td><code>java.util.concurrent.Flow</code>（Java 9+）</td>
    </tr>
    <tr>
      <td>Springのイベント</td>
      <td><code>ApplicationEvent</code> + <code>@EventListener</code></td>
    </tr>
    <tr>
      <td>Android</td>
      <td>LiveData、StateFlow（Kotlin）</td>
    </tr>
  </tbody>
</table>

<h2>Strategy パターンとの違い</h2>

<p>
  前回解説した <a href="/docs/strategy-pattern">Strategy パターン</a>と比較すると、
  目的が明確に異なります。
</p>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Strategy パターン</th>
      <th>Observer パターン</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>目的</td>
      <td>アルゴリズムの交換</td>
      <td>状態変化の通知</td>
    </tr>
    <tr>
      <td>関係</td>
      <td>1対1（Context と Strategy）</td>
      <td>1対多（Subject と複数Observer）</td>
    </tr>
    <tr>
      <td>タイミング</td>
      <td>呼び出し時に選択</td>
      <td>状態変化時に自動発火</td>
    </tr>
  </tbody>
</table>

<h2>まとめ</h2>

<p>
  Observerパターンは、<strong>「状態変化を複数の場所に伝えたい」</strong>ときに最も力を発揮します。
  Subject と Observer を疎結合に保つことで、新しい通知先を追加しても既存コードを一切変更せずに済みます。
  現代のリアクティブプログラミング（RxJava、Kotlin Flow）も、この思想を発展させたものです。
</p>
