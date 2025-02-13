import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Download, Shield, Lock } from 'lucide-react';

export function Legal() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Legal Information</h1>
        <p className="text-gray-400">Review our terms, policies, and legal documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Terms of Service</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Our terms of service outline the rules and guidelines for using OnlySurge.
              Last updated: March 1, 2024
            </p>
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Privacy Policy</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Learn how we collect, use, and protect your personal information.
              Last updated: March 1, 2024
            </p>
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Important Updates</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Privacy Policy Update",
                date: "March 1, 2024",
                description: "Updated data processing and storage policies to comply with new regulations."
              },
              {
                title: "Terms of Service Update",
                date: "February 15, 2024",
                description: "Added new sections regarding content monetization and platform usage."
              },
              {
                title: "Cookie Policy Update",
                date: "January 30, 2024",
                description: "Updated cookie preferences and tracking information."
              }
            ].map((update, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg bg-purple-900/20"
              >
                <Lock className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{update.title}</h3>
                    <span className="text-sm text-gray-400">{update.date}</span>
                  </div>
                  <p className="text-sm text-gray-400">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Additional Documents</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Cookie Policy",
              "DMCA Policy",
              "Community Guidelines",
              "Content Policy",
              "Refund Policy",
              "Age Verification Policy"
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>{doc}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}