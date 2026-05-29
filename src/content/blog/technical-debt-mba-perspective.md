---
title: MBAの視点から見る技術的負債：なぜマネージャーはリファクタリングに興味を示さないのか
description: エンジニアとビジネスサイドの間に存在する技術的負債への認識ギャップを、MBA×プロダクトエンジニアの視点から解説します。
publishDate: 2026-05-27
category: Product Engineering
tags: [technical-debt, product-management, agile, mba, engineering-culture]
---

<h2>「また技術的負債の話ですか？」</h2>

<p>
  エンジニアなら一度は経験しているはずです。スプリントレビューで
  「次のスプリントはリファクタリングに時間を使いたいです」と言った瞬間、
  プロダクトマネージャーやマネージャーの表情が微妙に曇る、あの瞬間。
</p>

<p>
  これは単なるコミュニケーション問題ではありません。
  <strong>認識のフレームワーク自体が根本的に違う</strong>のです。
</p>

<h2>エンジニアの言語 vs ビジネスの言語</h2>

<p>エンジニアが「技術的負債」と言うとき、実際に伝わっているものを整理してみましょう。</p>

<table>
  <thead>
    <tr>
      <th>エンジニアが言いたいこと</th>
      <th>マネージャーに聞こえていること</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>コードが複雑で変更に時間がかかる</td>
      <td>「過去の判断が悪かった」という批判</td>
    </tr>
    <tr>
      <td>このまま放置するとリスクが増える</td>
      <td>「具体的にいつ何が起きるのかは不明」</td>
    </tr>
    <tr>
      <td>リファクタリングに2スプリント必要</td>
      <td>「4週間、ユーザーに価値を届けられない」</td>
    </tr>
    <tr>
      <td>テストが書きにくい設計になっている</td>
      <td>「現在のシステムは動いているのでは？」</td>
    </tr>
  </tbody>
</table>

<p>
  どちらも悪意はありません。ただ、<strong>見ている時間軸とリスクの単位が違う</strong>のです。
</p>

<h2>MBAが教える「負債」の本質</h2>

<p>
  MBA のコーポレートファイナンスでは、負債（Debt）は必ずしも悪ではありません。
  <strong>適切に管理された負債は、成長を加速させる手段</strong>です。
  Ward Cunningham が技術的負債という概念を提唱したとき、まさにこの意味で使っていました。
</p>

<blockquote>
  <p>「コードを借金として出荷することで、素早く市場に出られる。
  ただし利子（＝開発速度の低下）を払い続けなければならない。」— Ward Cunningham, 1992</p>
</blockquote>

<p>
  問題は「負債そのもの」ではなく、<strong>「見えない負債」と「管理されていない負債」</strong>です。
  財務の世界では、オフバランスの隠れ負債が企業を破綻させます。技術的負債も同じです。
</p>

<h2>ビジネスに刺さる3つの翻訳フレーム</h2>

<h3>フレーム 1：機会費用で語る</h3>

<pre><code class="language-text">❌ エンジニアの言い方:
「認証モジュールが密結合で、新しい OAuth プロバイダーを
 追加するのに3週間かかります」

✅ ビジネスの言い方:
「現在の構造では、Google SSO の追加（競合他社は全て対応済み）に
 3週間かかります。改修に1スプリント投資すれば、
 今後の同様の機能追加は各1日以下になります。
 エンタープライズ商談で毎回 SSO 対応を聞かれている現状を
 考えると、ROI は3ヶ月以内に回収できます。」</code></pre>

<h3>フレーム 2：バグ率・インシデントコストに換算する</h3>

```java
// 技術的負債のコストを定量化するシンプルな計算モデル
public class TechnicalDebtCalculator {

    // 月間のバグ修正時間（時間）
    private final double monthlyBugFixHours;
    // 平均エンジニアの時給（円）
    private final double hourlyRate;
    // インシデント発生時の機会損失（円/件）
    private final double incidentCost;
    // 月間インシデント件数
    private final double monthlyIncidents;

    public double calculateMonthlyCost() {
        double laborCost = monthlyBugFixHours * hourlyRate;
        double incidentTotalCost = monthlyIncidents * incidentCost;
        return laborCost + incidentTotalCost;
    }

    public double calculateRefactoringROI(double refactoringCost,
                                          double expectedReduction) {
        // expectedReduction: コスト削減率 (例: 0.6 = 60%削減)
        double annualSaving = calculateMonthlyCost() * 12 * expectedReduction;
        return (annualSaving - refactoringCost) / refactoringCost * 100;
    }
}
```

<h3>フレーム 3：スプリントベロシティのグラフを見せる</h3>

<p>
  抽象的な「開発が遅くなる」ではなく、実際のベロシティの推移を可視化します。
  技術的負債が蓄積したスプリントと、改修後のスプリントを並べると、
  ビジネスサイドにも直感的に伝わります。
</p>

<pre><code class="language-text">ベロシティ推移（ストーリーポイント/スプリント）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 1:  ████████████████████ 40pt
Sprint 2:  █████████████████    34pt
Sprint 3:  ████████████████     32pt  ← "最近遅くなった気がする"
Sprint 4:  █████████████        26pt
Sprint 5:  ████████████         24pt
           ↑ここで技術的負債解消スプリント（1回）
Sprint 6:  ███████████████████  38pt
Sprint 7:  ████████████████████ 40pt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</code></pre>

<h2>「負債を積まない」より「負債を管理する」</h2>

<p>
  アジャイルの現場で現実的に重要なのは、技術的負債をゼロにすることではなく、
  <strong>意図的に管理すること</strong>です。以下の実践が有効です。
</p>

<ul>
  <li><strong>負債の可視化</strong> — バックログに "Tech Debt" タグを付け、ビジネス価値と同列に管理する</li>
  <li><strong>20% ルール</strong> — 毎スプリントのキャパシティの20%を技術的負債解消に充てることを合意する</li>
  <li><strong>ボーイスカウトルール</strong> — 触ったコードは必ず元より少し綺麗にして返す（大きなリファクタリングを不要にする）</li>
  <li><strong>負債の格付け</strong> — 全ての負債を同等に扱わない。利子の高い（開発速度への影響が大きい）ものから優先する</li>
</ul>

<h2>エンジニアとマネージャー、どちらが変わるべきか</h2>

<p>
  正直に言えば、<strong>どちらも変わる必要があります</strong>。
</p>

<p>
  エンジニアは「技術的な正しさ」だけを主張する習慣を手放し、
  ビジネスの言語（ROI、機会費用、リスク）で話す能力を身につけること。
</p>

<p>
  マネージャーは「動いているコードには触るな」という短期最適化の罠から抜け出し、
  エンジニアリングの健全性がプロダクトの持続可能性に直結することを理解すること。
</p>

<p>
  その橋渡しこそが、プロダクトエンジニア（Product Engineer）の役割です。
  コードも書け、ビジネスの文脈も理解できる人間が、
  この翻訳作業を担うとき、チームは初めて技術的負債を「資産管理」として扱えるようになります。
</p>

<h2>まとめ</h2>

<p>
  技術的負債は「エンジニアリングの問題」ではなく、<strong>「ビジネスリスクの問題」</strong>です。
  その認識をチーム全体で共有したとき、「リファクタリングをさせてください」という
  お願いベースのコミュニケーションから、「今投資すべき理由はこれです」という
  戦略的な対話へと変わります。
</p>

<p>
  次回のスプリント計画で、ぜひ一度「機会費用」の言葉で技術的負債を語ってみてください。
</p>
