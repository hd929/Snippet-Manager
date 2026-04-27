export const mockSnippets = [
  {
    id: 1,
    title: 'DSU (Disjoint Set Union)',
    code: `struct DSU {
    vector<int> parent, sz;
    DSU(int n) {
        parent.resize(n + 1);
        sz.resize(n + 1, 1);
        for(int i = 1; i <= n; i++) parent[i] = i;
    }
    int find(int v) {
        if (v == parent[v])
            return v;
        return parent[v] = find(parent[v]);
    }
    void unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a != b) {
            if (sz[a] < sz[b]) swap(a, b);
            parent[b] = a;
            sz[a] += sz[b];
        }
    }
};`,
    notes: 'Nhớ dùng path compression',
    complexity: { time: 'O(α(n))' }
  },
  {
    id: 2,
    title: 'BFS (Breadth-First Search)',
    code: `vector<vector<int>> adj;
int n; // số đỉnh
int s; // đỉnh nguồn

queue<int> q;
vector<bool> used(n);
vector<int> d(n), p(n);

q.push(s);
used[s] = true;
p[s] = -1;
while (!q.empty()) {
    int v = q.front();
    q.pop();
    for (int u : adj[v]) {
        if (!used[u]) {
            used[u] = true;
            q.push(u);
            d[u] = d[v] + 1;
            p[u] = v;
        }
    }
}`,
    notes: 'Dùng queue, độ phức tạp tuyến tính.',
    complexity: { time: 'O(V + E)' }
  },
  {
    id: 3,
    title: 'Segment Tree (Point Update, Range Query)',
    code: `struct SegmentTree {
    int n;
    vector<long long> tree;
    
    SegmentTree(int n) {
        this->n = n;
        tree.assign(4 * n, 0);
    }
    
    void build(vector<int>& a, int v, int tl, int tr) {
        if (tl == tr) {
            tree[v] = a[tl];
        } else {
            int tm = (tl + tr) / 2;
            build(a, v*2, tl, tm);
            build(a, v*2+1, tm+1, tr);
            tree[v] = tree[v*2] + tree[v*2+1];
        }
    }
    
    long long sum(int v, int tl, int tr, int l, int r) {
        if (l > r) 
            return 0;
        if (l == tl && r == tr) {
            return tree[v];
        }
        int tm = (tl + tr) / 2;
        return sum(v*2, tl, tm, l, min(r, tm))
             + sum(v*2+1, tm+1, tr, max(l, tm+1), r);
    }
    
    void update(int v, int tl, int tr, int pos, int new_val) {
        if (tl == tr) {
            tree[v] = new_val;
        } else {
            int tm = (tl + tr) / 2;
            if (pos <= tm)
                update(v*2, tl, tm, pos, new_val);
            else
                update(v*2+1, tm+1, tr, pos, new_val);
            tree[v] = tree[v*2] + tree[v*2+1];
        }
    }
};`,
    notes: 'Dùng cho các bài toán truy vấn đoạn.',
    complexity: { time: 'O(log N) cho mỗi truy vấn' }
  }
];
